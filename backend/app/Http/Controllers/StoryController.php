<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\User;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    protected function getUser(Request $request)
    {
        return $request->bearerToken()
            ? User::where('api_token', $request->bearerToken())->first()
            : null;
    }

    public function index()
    {
        $stories = Story::with('author')->latest()->get();

        return response()->json($stories);
    }

    public function store(Request $request)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'type' => 'required|in:text,photo',
            'content' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        $story = Story::create([
            'user_id' => $user->id,
            'type' => $data['type'],
            'content' => $data['content'] ?? null,
            'photo_url' => $data['photo_url'] ?? null,
        ]);

        return response()->json($story, 201);
    }
}
