<?php

namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(\Illuminate\Console\Scheduling\Schedule $schedule)
    {
        // Schedule commands here if needed.
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
    }
}
