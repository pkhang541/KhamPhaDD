<?php

namespace Tests\Feature;

use App\Models\Trip;
use App\Models\TripPlace;
use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripMemberInviteTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_find_registered_user_by_email_for_trip_invite(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'uid' => '1234567890',
            'name' => 'Invite Member',
            'email' => 'member@example.com',
        ]);

        $response = $this->actingAs($owner)->getJson('/users/by-email?email=member@example.com');

        $response->assertOk()
            ->assertJson([
                'id' => $member->id,
                'uid' => '1234567890',
                'name' => 'Invite Member',
                'email' => 'member@example.com',
            ]);
    }

    public function test_can_find_registered_user_by_uid_for_trip_invite(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'uid' => '2345678901',
            'name' => 'Uid Member',
            'email' => 'uid-member@example.com',
        ]);

        $response = $this->actingAs($owner)->getJson('/users/by-email?identifier=2345678901');

        $response->assertOk()
            ->assertJson([
                'id' => $member->id,
                'uid' => '2345678901',
                'name' => 'Uid Member',
                'email' => 'uid-member@example.com',
            ]);
    }

    public function test_user_search_does_not_expose_email_addresses(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'uid' => '3456789012',
            'name' => 'Searchable Member',
            'email' => 'searchable@example.com',
        ]);

        $response = $this->actingAs($owner)->getJson('/users/search?q=Searchable');

        $response->assertOk()
            ->assertJsonFragment([
                'id' => $member->id,
                'uid' => '3456789012',
                'name' => 'Searchable Member',
            ])
            ->assertJsonMissing([
                'email' => 'searchable@example.com',
            ]);
    }

    public function test_new_users_get_numeric_uid(): void
    {
        $user = User::factory()->create();

        $this->assertMatchesRegularExpression('/^[0-9]{10}$/', $user->uid);
    }

    public function test_cannot_invite_email_without_an_account(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->getJson('/users/by-email?email=missing@example.com');

        $response->assertNotFound()
            ->assertJson([
                'message' => 'Email hoặc UID này chưa có tài khoản. Người được mời cần đăng ký trước.',
            ]);
    }

    public function test_trip_store_requires_invited_emails_to_belong_to_existing_users(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->from('/trips')->post('/trips', [
            'title' => 'Trip with missing member',
            'invited_emails' => ['missing@example.com'],
        ]);

        $response->assertRedirect('/trips');
        $response->assertSessionHasErrors('invited_emails.0');
        $this->assertDatabaseMissing('trips', [
            'title' => 'Trip with missing member',
        ]);
    }

    public function test_trip_store_requires_at_least_one_place(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->from('/trips')->post('/trips', [
            'title' => 'Trip without places',
        ]);

        $response->assertRedirect('/trips');
        $response->assertSessionHasErrors('place_ids');
        $this->assertDatabaseMissing('trips', [
            'title' => 'Trip without places',
        ]);
    }

    public function test_trip_store_accepts_registered_invited_members(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'email' => 'member@example.com',
        ]);
        Category::create(['name' => 'Cafe', 'slug' => 'cafe']);
        $place = Place::factory()->create();

        $this->actingAs($owner)->post('/trips', [
            'title' => 'Trip with member',
            'invited_emails' => [$member->email],
            'place_ids' => [$place->id],
        ])->assertRedirect();

        $this->assertDatabaseHas('trips', [
            'title' => 'Trip with member',
            'user_id' => $owner->id,
            'members' => 2,
        ]);
        $this->assertSame(1, Trip::count());
    }

    public function test_user_cannot_remove_trip_place_from_another_trip(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        Category::create(['name' => 'Cafe', 'slug' => 'cafe']);
        $place = Place::factory()->create();
        $ownerTrip = Trip::create(['user_id' => $owner->id, 'title' => 'Owner trip']);
        $otherTrip = Trip::create(['user_id' => $otherUser->id, 'title' => 'Other trip']);
        $otherTripPlace = TripPlace::create([
            'trip_id' => $otherTrip->id,
            'place_id' => $place->id,
            'day_number' => 1,
            'order' => 0,
        ]);

        $this->actingAs($owner)
            ->delete(route('trips.removePlace', [$ownerTrip, $otherTripPlace]))
            ->assertNotFound();

        $this->assertDatabaseHas('trip_places', [
            'id' => $otherTripPlace->id,
            'trip_id' => $otherTrip->id,
        ]);
    }

    public function test_user_cannot_update_trip_place_time_from_another_trip(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        Category::create(['name' => 'Cafe', 'slug' => 'cafe']);
        $place = Place::factory()->create();
        $ownerTrip = Trip::create(['user_id' => $owner->id, 'title' => 'Owner trip']);
        $otherTrip = Trip::create(['user_id' => $otherUser->id, 'title' => 'Other trip']);
        $otherTripPlace = TripPlace::create([
            'trip_id' => $otherTrip->id,
            'place_id' => $place->id,
            'day_number' => 1,
            'order' => 0,
            'visit_time' => '09:00',
        ]);

        $this->actingAs($owner)
            ->patch(route('trips.updatePlaceTime', [$ownerTrip, $otherTripPlace]), [
                'visit_time' => '18:00',
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('trip_places', [
            'id' => $otherTripPlace->id,
            'visit_time' => '09:00',
        ]);
    }
}
