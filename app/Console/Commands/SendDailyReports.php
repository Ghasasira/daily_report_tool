<?php

namespace App\Console\Commands;

use App\Services\ReportDispatchService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendDailyReports extends Command
{
    protected $signature = 'email:send
                            {--date= : Report date (Y-m-d)}
                            {--range : Process a date range}';

    protected $description = 'Send daily reports to supervisors';

    public function handle(ReportDispatchService $service): int
    {
        $date = $this->option('date') ?? now()->subDay()->toDateString();

        $result = $service->dispatchForDate($date);

        if ($result['dispatched'] === 0) {
            $this->warn("No pending reports for {$date}");
            return Command::SUCCESS;
        }

        $this->info("✅ Dispatched {$result['dispatched']} reports for {$result['date']}");

        return Command::SUCCESS;
    }
}
