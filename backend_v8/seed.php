<?php
$u = new App\Models\User;
$u->username = 'demo';
$u->name = 'Demo User';
$u->avatar = 'https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff';
$u->bio = 'This is a demo account';
$u->api_token = hash('sha256', Illuminate\Support\Str::random(60));
$u->save();
echo "Demo user created.\n";
