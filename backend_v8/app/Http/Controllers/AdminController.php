<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;

class AdminController extends Controller
{
    public function getDashboardStats()
    {
        $popularCreators = User::withCount('followers')
            ->orderByDesc('followers_count')
            ->take(3)
            ->get(['id', 'username', 'avatar']);

        return response()->json([
            'totalUsers' => User::count(),
            'totalPosts' => Post::count(),
            'totalComments' => \App\Models\Comment::count(),
            'popularCreators' => $popularCreators,
            'activeUsersData' => [
                ['month' => 'Jan', 'value' => 12],
                ['month' => 'Feb', 'value' => 19],
                ['month' => 'Mar', 'value' => 30],
                ['month' => 'Apr', 'value' => 25],
                ['month' => 'May', 'value' => 22],
                ['month' => 'Jun', 'value' => 20],
                ['month' => 'Jul', 'value' => 18],
                ['month' => 'Aug', 'value' => 24],
                ['month' => 'Sep', 'value' => 28],
                ['month' => 'Oct', 'value' => 32],
                ['month' => 'Nov', 'value' => 26],
                ['month' => 'Dec', 'value' => 35]
            ]
        ]);
    }

    public function getAllUsers()
    {
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'is_admin' => $user->is_admin,
                'created_at' => $user->created_at->toISOString(),
            ];
        });

        return response()->json($users);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Prevent admin from deleting themselves
        if (auth()->id() == $id) {
            return response()->json(['message' => 'Cannot delete your own account'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getAllPosts()
    {
        $posts = Post::with('author')->orderBy('created_at', 'desc')->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'authorUsername' => $post->author->username ?? 'Unknown',
                'content' => $post->content,
                'photoUrl' => $post->photo_url,
                'videoUrl' => $post->video_url,
                'created_at' => $post->created_at->toISOString(),
            ];
        });

        return response()->json($posts);
    }

    public function deletePost($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
