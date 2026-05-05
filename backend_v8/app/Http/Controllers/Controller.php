<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function handleBase64Image($base64String, $folder = 'uploads')
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif, webp, avif
            
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp', 'avif'])) {
                return $base64String; // Not a supported image
            }

            $data = base64_decode($data);
            if ($data === false) {
                return $base64String;
            }

            $fileName = \Illuminate\Support\Str::random(40) . '.' . $type;
            $path = $folder . '/' . $fileName;

            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $data);

            return url('storage/' . $path);
        }

        return $base64String; // Return as is if it's not base64 or already a URL
    }

    protected function handleBase64Video($base64String, $folder = 'uploads')
    {
        if (preg_match('/^data:video\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]); // mp4, webm, mov
            
            if (!in_array($type, ['mp4', 'webm', 'ogg', 'mov', 'quicktime'])) {
                return $base64String; // Not a supported video
            }

            $data = base64_decode($data);
            if ($data === false) {
                return $base64String;
            }

            $extension = $type === 'quicktime' ? 'mov' : $type;
            $fileName = \Illuminate\Support\Str::random(40) . '.' . $extension;
            $path = $folder . '/' . $fileName;

            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $data);

            return url('storage/' . $path);
        }

        return $base64String;
    }
}
