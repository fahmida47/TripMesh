<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateAdmin extends Command
{
    protected $signature = 'admin:create {name} {phone}';
    protected $description = 'Create or update a trusted TripMesh admin account';

    public function handle(): int
    {
        $name = trim((string) $this->argument('name'));
        $phone = trim((string) $this->argument('phone'));

        if ($name === '' || strlen($phone) < 10 || strlen($phone) > 20) {
            $this->error('Provide a name and a phone number between 10 and 20 characters.');
            return self::FAILURE;
        }

        $user = User::where('phone', $phone)->first();
        if ($user && $user->role !== 'admin') {
            $this->error('That phone number is already registered to a tourist or guide.');
            return self::FAILURE;
        }

        $user ??= new User();
        $user->name = $name;
        $user->phone = $phone;
        $user->role = 'admin';
        $user->save();

        $this->info("Admin account ready for {$phone}. Use /admin/login to sign in.");
        return self::SUCCESS;
    }
}
