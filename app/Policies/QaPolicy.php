<?php

namespace App\Policies;

use App\Models\Qa;
use App\Models\User;

class QaPolicy
{
    public function delete(User $user, Qa $qa): bool
    {
        return $user->id === $qa->user_id || $user->isAdmin();
    }
}
