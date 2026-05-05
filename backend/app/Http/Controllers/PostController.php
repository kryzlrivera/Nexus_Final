<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    protected function getUser(Request $request)
    {
        return $request->bearerToken()
            ? User::where('api_token', $request->bearerToken())->first()
            : null;
    }

    public function index()
    {
        $posts = Post::with(['author', 'comments.author', 'likes'])->latest()->get();

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'content' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        if (empty(trim((string) ($data['content'] ?? ''))) && empty($data['photo_url'])) {
            return response()->json(['message' => 'Content or photo URL is required'], 422);
        }

        $post = Post::create([
            'user_id' => $user->id,
            'content' => $data['content'] ?? '',
            'photo_url' => $data['photo_url'] ?? null,
        ]);

        return response()->json($post, 201);
    }

    public function toggleLike(Request $request, Post $post)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($post->likes()->where('user_id', $user->id)->exists()) {
            $post->likes()->detach($user->id);
        } else {
            $post->likes()->attach($user->id);
        }

        return response()->json(['likes' => $post->likes()->count()]);
    }

    public function comment(Request $request, Post $post)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $post->comments()->create([
            'user_id' => $user->id,
            'content' => $data['content'],
        ]);

        return response()->json($comment, 201);
    }

    public function toggleSave(Request $request, Post $post)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($post->savedBy()->where('user_id', $user->id)->exists()) {
            $post->savedBy()->detach($user->id);
            return response()->json(['saved' => false]);
        }

        $post->savedBy()->attach($user->id);
        return response()->json(['saved' => true]);
    }
}
