<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'avatar',
        'bio',
        'api_token',
        'is_admin',
    ];

    protected $hidden = [
        'api_token',
        'created_at',
        'updated_at',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    public function friends()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'friendships', 'friend_id', 'user_id');
    }

    public function likes()
    {
        return $this->belongsToMany(Post::class, 'likes');
    }

    public function savedPosts()
    {
        return $this->belongsToMany(Post::class, 'saved_posts');
    }
}
