<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\SendDailyReportJob;
use App\Models\Report;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $reports = Report::whereNull('email_sent_at')->get();

    foreach ($reports as $report) {
        SendDailyReportJob::dispatch($report);
    }
})->cron('*/5 * * * *');
// ->dailyAt('08:00');
