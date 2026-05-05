<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected function getUser(Request $request)
    {
        return $request->bearerToken()
            ? User::where('api_token', $request->bearerToken())->first()
            : null;
    }

    public function index(Request $request, $username)
    {
        $authUser = $this->getUser($request);
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $friend = User::where('username', $username)->first();
        if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $messages = Message::where(function ($query) use ($authUser, $friend) {
            $query->where('sender_id', $authUser->id)
                  ->where('receiver_id', $friend->id);
        })->orWhere(function ($query) use ($authUser, $friend) {
            $query->where('sender_id', $friend->id)
                  ->where('receiver_id', $authUser->id);
        })->orderBy('created_at', 'asc')->get()->map(function ($msg) {
            return [
                'id' => (string)$msg->id,
                'senderUsername' => $msg->sender->username,
                'receiverUsername' => $msg->receiver->username,
                'content' => $msg->content,
                'timestamp' => $msg->created_at->toISOString(),
            ];
        });

        return response()->json($messages);
    }

    public function store(Request $request, $username)
    {
        $authUser = $this->getUser($request);
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $friend = User::where('username', $username)->first();
        if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $authUser->id,
            'receiver_id' => $friend->id,
            'content' => $data['content'],
        ]);

        return response()->json([
            'id' => (string)$message->id,
            'senderUsername' => $message->sender->username,
            'receiverUsername' => $message->receiver->username,
            'content' => $message->content,
            'timestamp' => $message->created_at->toISOString(),
        ], 201);
    }
}
