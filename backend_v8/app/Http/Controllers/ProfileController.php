<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected function getUser(Request $request)
    {
        return $request->bearerToken()
            ? User::where('api_token', $request->bearerToken())->first()
            : null;
    }

    public function show($username)
    {
        $user = User::where('username', $username)
            ->with(['posts', 'friends', 'followers'])
            ->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $username)
    {
        $authUser = $this->getUser($request);
        if (! $authUser || $authUser->username !== $username) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'name' => 'required|string|min:2',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
        ]);

        if (!empty($data['avatar'])) {
            $data['avatar'] = $this->handleBase64Image($data['avatar'], 'avatars');
        }

        $authUser->update($data);

        return response()->json($authUser);
    }

    public function toggleFollow(Request $request, $username)
    {
        $authUser = $this->getUser($request);
        if (! $authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $target = User::where('username', $username)->first();
        if (! $target) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($authUser->id === $target->id) {
            return response()->json(['message' => 'Cannot follow yourself'], 400);
        }

        $result = $authUser->friends()->toggle($target->id);

        return response()->json(['following' => count($result['attached']) > 0]);
    }
}
