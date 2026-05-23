<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function message(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        $message = trim($data['message']);
        $normalized = $this->normalize($message);
        $cities = City::query()->has('places')->withCount('places')->get();
        $categories = Category::query()->withCount('places')->get();

        $matchedCity = $cities->first(fn ($city) => $this->contains($normalized, $city->name));
        $matchedCategory = $categories->first(fn ($category) => $this->contains($normalized, $category->name))
            ?: $this->inferCategory($normalized, $categories);

        if ($this->isHelpIntent($normalized)) {
            return response()->json($this->helpResponse($categories, $cities));
        }

        $recommendationIntent = $this->isRecommendationIntent($normalized);

        if ($this->isTripIntent($normalized)) {
            return response()->json(
                $recommendationIntent
                    ? $this->suggestedTripResponse()
                    : $this->tripResponse()
            );
        }

        if ($this->isMapIntent($normalized) && !$recommendationIntent && !$matchedCity && !$matchedCategory) {
            return response()->json($this->mapResponse());
        }

        $places = $this->matchingPlaces($message, $matchedCity, $matchedCategory, $recommendationIntent);

        return response()->json([
            'reply' => $this->buildReply($places, $matchedCity, $matchedCategory, $recommendationIntent),
            'places' => $places->map(fn ($place) => [
                'id' => $place->id,
                'name' => $place->name,
                'slug' => $place->slug,
                'address' => $place->address,
                'city' => $place->city?->name,
                'category' => $place->category?->name,
                'rating' => $place->avg_rating ? (float) $place->avg_rating : null,
                'image' => $place->image,
                'url' => "/places/{$place->slug}",
                'reason' => $this->placeReason($place, $matchedCity, $matchedCategory),
            ])->values(),
            'actions' => $this->searchActions($message, $matchedCity, $matchedCategory),
        ]);
    }

    private function matchingPlaces(string $message, ?City $city, ?Category $category, bool $recommendationIntent = false)
    {
        $query = Place::query()
            ->with(['city:id,name', 'category:id,name'])
            ->select(['id', 'name', 'slug', 'address', 'description', 'image', 'avg_rating', 'view_count', 'city_id', 'category_id'])
            ->whereNull('deleted_at');

        if ($city) {
            $query->where('city_id', $city->id);
        }

        if ($category) {
            $query->where('category_id', $category->id);
        }

        $keywords = $this->keywords($message);

        if (!$recommendationIntent && !$city && !$category && $keywords->isNotEmpty()) {
            $query->where(function ($q) use ($keywords) {
                foreach ($keywords->take(4) as $keyword) {
                    $q->orWhere('name', 'like', "%{$keyword}%")
                        ->orWhere('address', 'like', "%{$keyword}%")
                        ->orWhere('description', 'like', "%{$keyword}%");
                }
            });
        }

        if ($this->contains($this->normalize($message), 'moi') || $this->contains($this->normalize($message), 'mới')) {
            return $query->orderByDesc('created_at')->limit(4)->get();
        }

        return $query
            ->orderByRaw('(COALESCE(avg_rating, 0) * 20) + (COALESCE(view_count, 0) * 0.3) DESC')
            ->orderByDesc('created_at')
            ->limit(4)
            ->get();
    }

    private function buildReply($places, ?City $city, ?Category $category, bool $recommendationIntent): string
    {
        if ($places->isEmpty()) {
            return 'Mình chưa tìm thấy địa điểm thật khớp với câu hỏi này. Bạn có thể nói rõ hơn khu vực, loại trải nghiệm, thời gian đi hoặc ngân sách để mình lọc sát hơn. Bạn có muốn mình gợi ý theo hướng gần đúng không?';
        }

        $scope = collect([
            $category?->name,
            $city?->name ? "ở {$city->name}" : null,
        ])->filter()->join(' ');

        if ($recommendationIntent) {
            return $scope
                ? "Mình hiểu là bạn đang muốn tìm vài lựa chọn {$scope}. Mình chọn trước những nơi có đánh giá ổn, được quan tâm nhiều và phù hợp với ý bạn vừa nói. Bạn xem thử các gợi ý bên dưới nhé:"
                : 'Mình chọn trước vài địa điểm nổi bật trong KhamPhaDD, ưu tiên nơi có đánh giá tốt và được nhiều người quan tâm. Bạn xem thử các lựa chọn bên dưới nhé:';
        }

        return $scope
            ? "Mình thấy bạn đang nhắc tới {$scope}. Trong dữ liệu của web có vài nơi khá hợp, mình để bên dưới để bạn xem nhanh. Bạn có muốn mình gợi ý lịch trình cụ thể hơn không?"
            : 'Mình có thể giúp bạn tìm địa điểm, mở bản đồ hoặc tạo chuyến đi theo ngày. Hiện mình tìm được vài địa điểm nổi bật trong KhamPhaDD để bạn tham khảo trước. Bạn có muốn mình gợi ý không?';
    }

    private function placeReason(Place $place, ?City $city, ?Category $category): string
    {
        $reasons = [];

        if ($place->avg_rating && (float) $place->avg_rating >= 4) {
            $reasons[] = 'đánh giá cao';
        }

        if ($place->view_count > 0) {
            $reasons[] = 'được nhiều người quan tâm';
        }

        if ($category && $place->category_id === $category->id) {
            $reasons[] = "đúng nhóm {$category->name}";
        }

        if ($city && $place->city_id === $city->id) {
            $reasons[] = "phù hợp khu vực {$city->name}";
        }

        if (!$reasons) {
            $reasons[] = 'phù hợp để khám phá thêm';
        }

        return 'Vì nơi này ' . implode(', ', array_slice($reasons, 0, 3)) . '.';
    }

    private function searchActions(string $message, ?City $city, ?Category $category): array
    {
        if (!auth()->check()) {
            return [
                ['label' => 'Đăng nhập để khám phá', 'url' => '/login'],
            ];
        }

        $params = [];
        if ($city) {
            $params['city_id'] = $city->id;
        }
        if ($category) {
            $params['category_id'] = $category->id;
        }
        if (!$city && !$category) {
            $params['q'] = $message;
        }

        return [
            ['label' => 'Xem kết quả đầy đủ', 'url' => '/search?' . http_build_query($params)],
            ['label' => 'Mở bản đồ', 'url' => '/map'],
            ['label' => 'Tạo chuyến đi', 'url' => '/trips'],
        ];
    }

    private function helpResponse($categories, $cities): array
    {
        $categoryNames = $categories->sortByDesc('places_count')->take(4)->pluck('name')->join(', ');
        $cityNames = $cities->sortByDesc('places_count')->take(4)->pluck('name')->join(', ');

        return [
            'reply' => "Bạn có thể nói với mình theo kiểu rất tự nhiên, ví dụ: \"mình muốn đi cafe yên tĩnh\", \"cuối tuần nên đi đâu\", \"mở bản đồ\", hoặc \"tạo chuyến đi\". Hiện web có các nhóm nổi bật như {$categoryNames}, và các khu vực như {$cityNames}. Nếu bạn chưa biết bắt đầu từ đâu, mình có thể hỏi thêm vài ý nhỏ rồi lọc địa điểm phù hợp hơn. Bạn có muốn mình gợi ý không?",
            'places' => [],
            'actions' => [
                ['label' => auth()->check() ? 'Khám phá địa điểm' : 'Đăng nhập để khám phá', 'url' => auth()->check() ? '/search' : '/login'],
            ],
        ];
    }

    private function tripResponse(): array
    {
        return [
            'reply' => auth()->check()
                ? 'Bạn có thể mở mục Chuyến đi để tạo lịch trình, thêm địa điểm yêu thích, chọn ngày đi và sắp xếp từng điểm theo thứ tự tham quan. Nếu bạn chưa có ý tưởng rõ ràng, mình có thể bắt đầu từ kiểu đi 1 ngày, cuối tuần hoặc nghỉ dưỡng nhẹ rồi gợi ý điểm phù hợp. Bạn có muốn mình gợi ý một lịch trình mẫu không?'
                : 'Bạn cần đăng nhập để tạo lịch trình cá nhân. Sau khi đăng nhập, mục Chuyến đi sẽ giúp bạn gom địa điểm, chọn ngày, chọn giờ xuất phát và sắp xếp lịch trình. Bạn có muốn mình gợi ý trước vài kiểu chuyến đi để tham khảo không?',
            'places' => [],
            'actions' => [
                [
                    'label' => auth()->check() ? 'Mở chuyến đi' : 'Đăng nhập',
                    'url' => auth()->check() ? '/trips' : '/login',
                ],
            ],
        ];
    }

    private function suggestedTripResponse(): array
    {
        return [
            'reply' => "Mình gợi ý trước vài kiểu lịch trình dễ dùng nhé:\n\n1. Một ngày chill: sáng đi cafe hoặc điểm check-in nhẹ, trưa ăn uống gần trung tâm, chiều chọn thêm một điểm tham quan ngắn.\n\n2. Cuối tuần khám phá: ngày 1 ưu tiên các điểm nổi bật và ăn uống, ngày 2 đi chậm hơn với cafe, homestay hoặc nơi có không gian thư giãn.\n\n3. Nghỉ dưỡng nhẹ: chọn nơi ở đẹp làm điểm chính, sau đó thêm 2 đến 3 địa điểm gần đó để lịch trình không bị quá dày.\n\nNếu bạn muốn, mình có thể lọc tiếp theo khu vực, sở thích hoặc số ngày đi. Bạn có muốn mình gợi ý chi tiết hơn không?",
            'places' => [],
            'actions' => [
                [
                    'label' => auth()->check() ? 'Mở chuyến đi' : 'Đăng nhập',
                    'url' => auth()->check() ? '/trips' : '/login',
                ],
                [
                    'label' => 'Khám phá địa điểm',
                    'url' => auth()->check() ? '/search' : '/login',
                ],
            ],
        ];
    }

    private function mapResponse(): array
    {
        return [
            'reply' => auth()->check()
                ? 'Mình có thể mở bản đồ để bạn xem các địa điểm theo vị trí trực quan, dễ nhận ra điểm nào gần nhau để gom vào cùng một buổi đi. Nếu bạn muốn đi nhanh và ít vòng đường, mình sẽ ưu tiên các nơi cùng khu vực. Bạn có muốn mình gợi ý vài điểm gần nhau trên bản đồ không?'
                : 'Bản đồ cần đăng nhập để sử dụng. Sau khi đăng nhập, bạn có thể xem địa điểm trên bản đồ tương tác và chọn những nơi gần nhau hơn để tạo chuyến đi gọn. Bạn có muốn mình gợi ý trước vài điểm đáng xem không?',
            'places' => [],
            'actions' => [
                [
                    'label' => auth()->check() ? 'Mở bản đồ' : 'Đăng nhập',
                    'url' => auth()->check() ? '/map' : '/login',
                ],
            ],
        ];
    }

    private function inferCategory(string $normalized, $categories): ?Category
    {
        $groups = [
            ['cafe', 'ca phe', 'coffee', 'quan cafe', 'quán cafe', 'cà phê'],
            ['an vat', 'ăn vặt', 'tra sua', 'trà sữa', 'banh trang', 'bánh tráng', 'che', 'chè', 'an nhe', 'ăn nhẹ'],
            ['an chay', 'ăn chay', 'thuan chay', 'thuần chay', 'thuc duong', 'thực dưỡng'],
            ['an', 'ăn', 'am thuc', 'ẩm thực', 'nha hang', 'nhà hàng', 'mon', 'món'],
            ['hoc tap', 'học tập', 'lam viec', 'làm việc', 'doc sach', 'đọc sách', 'yen tinh', 'yên tĩnh', 'hoc', 'học'],
            ['mua sam', 'mua sắm', 'cho', 'chợ', 'shopping', 'trung tam thuong mai'],
            ['sieu thi', 'siêu thị', 'bach hoa', 'bách hóa', 'mart', 'tap hoa'],
            ['check-in', 'tham quan', 'du lich', 'du lịch', 'song ao', 'sống ảo', 'chup hinh', 'chụp hình'],
            ['khach san', 'khách sạn', 'homestay', 'resort', 'nghi duong', 'nghỉ dưỡng', 'noi o', 'nơi ở'],
            ['bar', 'club', 'dem', 'đêm', 'pub', 'rooftop'],
            ['chua', 'chùa', 'nha tho', 'nhà thờ', 'tam linh', 'tâm linh', 'ton giao', 'tôn giáo'],
            ['du lich sinh thai', 'du lịch sinh thái', 'sinh thai', 'sinh thái', 'farmstay', 'vuon', 'vườn'],
        ];

        foreach ($groups as $terms) {
            if (!collect($terms)->contains(fn ($term) => $this->contains($normalized, $term))) {
                continue;
            }

            return $categories->first(function ($category) use ($terms) {
                $categoryName = $this->normalize($category->name);
                return collect($terms)->contains(fn ($term) => $this->contains($categoryName, $term));
            });
        }

        return null;
    }

    private function keywords(string $message)
    {
        return collect(preg_split('/\s+/u', $this->normalize($message)))
            ->map(fn ($word) => trim($word, " .,!?;:\"'()[]{}"))
            ->filter(fn ($word) => mb_strlen($word) >= 3)
            ->reject(fn ($word) => in_array($word, [
                'cho', 'toi', 'tim', 'goi', 'gợi', 'dia', 'diem', 'quan', 'quán',
                'gan', 'nhat', 'voi', 'khong', 'nen', 'cua', 'ban', 'minh',
            ], true))
            ->values();
    }

    private function normalize(string $value): string
    {
        return Str::of($value)->lower()->ascii()->toString();
    }

    private function contains(string $haystack, string $needle): bool
    {
        return mb_stripos($haystack, $this->normalize($needle)) !== false;
    }

    private function isHelpIntent(string $normalized): bool
    {
        return collect(['help', 'huong dan', 'ban lam gi'])->contains(
            fn ($term) => $this->contains($normalized, $term)
        );
    }

    private function isTripIntent(string $normalized): bool
    {
        return collect(['chuyen di', 'lich trinh', 'trip', 'ke hoach'])->contains(
            fn ($term) => $this->contains($normalized, $term)
        );
    }

    private function isMapIntent(string $normalized): bool
    {
        return collect(['ban do', 'map', 'quanh day'])->contains(
            fn ($term) => $this->contains($normalized, $term)
        );
    }

    private function isRecommendationIntent(string $normalized): bool
    {
        return collect([
            'ai goi y',
            'goi y',
            'de xuat',
            'noi bat',
            'top',
            'nen di dau',
            'dang thu',
            'cuoi tuan',
            'hom nay',
            'gan toi',
        ])->contains(fn ($term) => $this->contains($normalized, $term));
    }
}
