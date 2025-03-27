<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use App\Models\PulseSurveySetting;
use App\Jobs\SendPulseSurvey;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SendPulseSurveyEmails extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'pulse_survey:send';

    /**
     * The console command description.
     */
    protected $description = 'Send engagement survey emails based on settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // コマンド開始ログ
        $this->info("survey:send command started at " . now());
        Log::info("survey:send command started at " . now());

        // 今日の日付を取得
        $today = Carbon::today();
        $this->info("Today's date: " . $today->toDateString());
        Log::info("Today's date: " . $today->toDateString());

        // 各企業ごとに最新のレコードを一件ずつ取得
        $settings = PulseSurveySetting::select('pulse_survey_settings.*')->join(
            DB::raw('(SELECT tenant_id, MAX(id) AS max_id FROM pulse_survey_settings GROUP BY tenant_id) as latest'),
            fn($join) => $join->on('pulse_survey_settings.tenant_id', '=', 'latest.tenant_id')
                ->on('pulse_survey_settings.id', '=', 'latest.max_id')
        )->get();
        $this->info("Retrieved " . $settings->count() . " settings.");
        Log::info("Retrieved " . $settings->count() . " settings.");

        // 本日が配信日かチェック
        foreach ($settings as $setting) {
            $this->info("Processing tenant_id={$setting->tenant_id} with start day {$setting->start_date} and interval {$setting->survey_delivery_interval_days} days.");
            Log::info("Processing tenant_id={$setting->tenant_id} with start day {$setting->start_date} and interval {$setting->survey_delivery_interval_days} days.");

            $startDay = Carbon::parse($setting->start_date);
            $interval = $setting->survey_delivery_interval_days;

            // まだ開始日が来ていない場合はスキップ
            if ($today->lt($startDay)) {
                $this->info("Skipping tenant_id={$setting->tenant_id} because today's date is before the start day (" . $startDay->toDateString() . ").");
                Log::info("Skipping tenant_id={$setting->tenant_id} because today's date is before the start day (" . $startDay->toDateString() . ").");
                continue;
            }

            // 開始日から何日経過したか
            $daysFromStart = $startDay->diffInDays($today);
            $this->info("Tenant_id={$setting->tenant_id}: Days from start = $daysFromStart");
            Log::info("Tenant_id={$setting->tenant_id}: Days from start = $daysFromStart");

            // 送信日かどうか (経過日数が interval の倍数なら送信)
            if ($daysFromStart % $interval === 0) {
                $this->info("Dispatching job for tenant_id={$setting->tenant_id}.");
                Log::info("Dispatching job for tenant_id={$setting->tenant_id}.");

                // ジョブをディスパッチ (非同期実行)
                SendPulseSurvey::dispatch(
                    $setting->tenant_id,
                    $setting->id,
                    $today->toDateString()
                );
            } else {
                $this->info("Not a scheduled send day for tenant_id={$setting->tenant_id} (days from start: $daysFromStart, interval: $interval).");
                Log::info("Not a scheduled send day for tenant_id={$setting->tenant_id} (days from start: $daysFromStart, interval: $interval).");
            }
        }

        $this->info("survey:send command finished at " . now());
        Log::info("survey:send command finished at " . now());

        return 0;
    }
}
