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
        $posts = Post::with(['author', 'comments.author', 'likes'])->latest()->get()->map(function ($post) {
            return [
                'id' => (string)$post->id,
                'authorUsername' => $post->author->username ?? '',
                'content' => $post->content,
                'photoUrl' => $post->photo_url,
                'videoUrl' => $post->video_url,
                'timestamp' => $post->created_at->toISOString(),
                'likes' => $post->likes->pluck('username'),
                'comments' => $post->comments->map(function ($comment) {
                    return [
                        'id' => (string)$comment->id,
                        'authorUsername' => $comment->author->username ?? '',
                        'content' => $comment->content,
                        'timestamp' => $comment->created_at->toISOString(),
                    ];
                }),
            ];
        });

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
            'photo_url' => 'nullable|string',
            'video_url' => 'nullable|string',
        ]);

        if (empty(trim((string) ($data['content'] ?? ''))) && empty($data['photo_url']) && empty($data['video_url'])) {
            return response()->json(['message' => 'Content, photo URL, or video URL is required'], 422);
        }

        $photoUrl = null;
        if (!empty($data['photo_url'])) {
            $photoUrl = $this->handleBase64Image($data['photo_url'], 'posts');
        }

        $videoUrl = null;
        if (!empty($data['video_url'])) {
            $videoUrl = $this->handleBase64Video($data['video_url'], 'posts');
        }

        $post = Post::create([
            'user_id' => $user->id,
            'content' => $data['content'] ?? '',
            'photo_url' => $photoUrl,
            'video_url' => $videoUrl,
        ]);

        return response()->json($post, 201);
    }

    public function toggleLike(Request $request, Post $post)
    {
        $user = $this->getUser($request);
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $post->likes()->toggle($user->id);

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

        $result = $post->savedBy()->toggle($user->id);
        return response()->json(['saved' => count($result['attached']) > 0]);
    }
}
