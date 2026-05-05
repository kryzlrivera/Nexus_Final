<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|alpha_dash|unique:users,username|min:3',
            'name' => 'required|string|min:2',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'name' => $data['name'],
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($data['name']) . '&background=2563eb&color=fff',
            'bio' => '',
            'api_token' => hash('sha256', Str::random(60)),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->api_token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string',
        ]);

        $user = User::where('username', $data['username'])->first();
        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->api_token = hash('sha256', Str::random(60));
        $user->save();

        return response()->json([
            'user' => $user,
            'token' => $user->api_token,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if (! $token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('api_token', $token)->first();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function users()
    {
        $users = User::with('friends')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'friends' => $user->friends->pluck('username'),
                'savedPosts' => [],
            ];
        });

        return response()->json($users);
    }
}
