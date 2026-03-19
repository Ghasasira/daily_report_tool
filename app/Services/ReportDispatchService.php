<?php

namespace App\Services;

use App\Jobs\SendDailyReportJob;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportDispatchService
{
    public function dispatchForDate(string $date): array
    {
        $reports = $this->getPendingReports($date);

        if ($reports->isEmpty()) {
            return ['dispatched' => 0, 'date' => $date];
        }

        $reports->each(fn($report) => SendDailyReportJob::dispatch($report));

        return [
            'dispatched' => $reports->count(),
            'date' => $date,
        ];
    }

    public function dispatchForDateRange(string $startDate, string $endDate): Collection
    {
        $results = collect();

        $currentDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        while ($currentDate->lte($endDate)) {
            $results->put(
                $currentDate->toDateString(),
                $this->dispatchForDate($currentDate->toDateString())
            );
            $currentDate->addDay();
        }

        return $results;
    }

    protected function getPendingReports(string $date): Collection
    {
        return Report::query()
            ->whereNull('email_sent_at')
            ->get();
    }
}
