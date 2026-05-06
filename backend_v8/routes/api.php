<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::get('users', [AuthController::class, 'users']);

Route::get('posts', [PostController::class, 'index']);
Route::post('posts', [PostController::class, 'store']);
Route::post('posts/{post}/toggle-like', [PostController::class, 'toggleLike']);
Route::post('posts/{post}/comment', [PostController::class, 'comment']);
Route::post('posts/{post}/toggle-save', [PostController::class, 'toggleSave']);

Route::get('stories', [StoryController::class, 'index']);
Route::post('stories', [StoryController::class, 'store']);

Route::get('profiles/{username}', [ProfileController::class, 'show']);
Route::put('profiles/{username}', [ProfileController::class, 'update']);
Route::post('profiles/{username}/follow', [ProfileController::class, 'toggleFollow']);

Route::get('messages/{username}', [MessageController::class, 'index']);
Route::post('messages/{username}', [MessageController::class, 'store']);

// Admin Routes
Route::middleware([\App\Http\Middleware\IsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/stats', [\App\Http\Controllers\AdminController::class, 'getDashboardStats']);
    Route::get('/users', [\App\Http\Controllers\AdminController::class, 'getAllUsers']);
    Route::delete('/users/{id}', [\App\Http\Controllers\AdminController::class, 'deleteUser']);
    Route::get('/posts', [\App\Http\Controllers\AdminController::class, 'getAllPosts']);
    Route::delete('/posts/{id}', [\App\Http\Controllers\AdminController::class, 'deletePost']);
});

Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');

