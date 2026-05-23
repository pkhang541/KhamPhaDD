<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Place;

class CleanPlacesWithoutCoordinates extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'places:clean-no-coords';

    /**
     * The console command description.
     */
    protected $description = 'Delete all Place records that do not have latitude or longitude values.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Place::whereNull('latitude')
            ->orWhereNull('longitude')
            ->count();

        if ($count === 0) {
            $this->info('Không có địa điểm nào thiếu tọa độ.' );
            return Command::SUCCESS;
        }

        $this->warn("Sẽ xóa {$count} địa điểm không có tọa độ. Bạn chắc chắn? (y/N)");
        $confirm = strtolower($this->ask('Nhập y để xác nhận'));
        if ($confirm !== 'y') {
            $this->info('Hủy bỏ thao tác.');
            return Command::SUCCESS;
        }

        $deleted = Place::whereNull('latitude')
            ->orWhereNull('longitude')
            ->delete();

        $this->info("Đã xóa {$deleted} địa điểm không có tọa độ.");
        return Command::SUCCESS;
    }
}
?>
