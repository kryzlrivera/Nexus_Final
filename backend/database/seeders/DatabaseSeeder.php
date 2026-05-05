<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $demo = User::create([
            'username' => 'demo',
            'name' => 'Demo User',
            'avatar' => 'https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff',
            'bio' => 'Hello, I\'m using Nexus!',
            'api_token' => hash('sha256', Str::random(60)),
        ]);

        $john = User::create([
            'username' => 'john_doe',
            'name' => 'John Doe',
            'avatar' => 'https://ui-avatars.com/api/?name=John+Doe&background=random',
            'bio' => 'Just another day.',
            'api_token' => hash('sha256', Str::random(60)),
        ]);

        $post1 = Post::create([
            'user_id' => $john->id,
            'content' => 'Loving the new Nexus social media app!',
        ]);

        $post2 = Post::create([
            'user_id' => $demo->id,
            'content' => 'Beautiful sunset today.',
            'photo_url' => 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ]);

        Comment::create([
            'post_id' => $post1->id,
            'user_id' => $demo->id,
            'content' => 'Same here!',
        ]);

        Story::create([
            'user_id' => $john->id,
            'type' => 'text',
            'content' => 'What a great day!',
        ]);

        $demo->friends()->attach($john->id);
        $john->friends()->attach($demo->id);
    }
}
