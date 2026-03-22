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
            'date'       => $date,
        ];
    }

    public function dispatchForDateRange(string $startDate, string $endDate): Collection
    {
        $results = collect();

        $currentDate = Carbon::parse($startDate);
        $end         = Carbon::parse($endDate);

        while ($currentDate->lte($end)) {
            $dateString = $currentDate->toDateString();

            $results->put(
                $dateString,
                $this->dispatchForDate($dateString)
            );

            $currentDate->addDay();
        }

        return $results;
    }

    /**
     * Fetch reports for the given date that have not yet had an email sent.
     *
     * Previously this method ignored the $date parameter entirely, causing
     * every dispatch call to retry ALL unsent reports across all dates.
     */
    protected function getPendingReports(string $date): Collection
    {
        return Report::query()
            ->whereDate('report_date', $date)
            ->whereNull('email_sent_at')
            ->where(fn($q) => $q
                ->where('email_status', 'pending')
                ->orWhereNull('email_status')
                ->orWhere('email_status', 'failed')  // allow retry of previously failed reports
            )
            ->with(['user', 'team'])
            ->get();
    }
}