<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PulseSurveyInstanceSeeder extends Seeder
{
    /**
     * パルスサーベイ実施のシード
     */
    public function run(): void
    {
        $now = Carbon::now();
        $instances = [];
        
        // テナント1のパルスサーベイ実施（直近6ヶ月分）
        $tenant1Settings = DB::table('pulse_survey_settings')
            ->where('tenant_id', 1)
            ->first();
        
        // テナント1の部門を取得
        $tenant1Departments = DB::table('departments')
            ->where('tenant_id', 1)
            ->get();
        
        $tenant1StartDate = Carbon::parse($tenant1Settings->start_date);
        $tenant1EndDate = Carbon::now()->subDays(7); // 1週間前まで
        
        $currentDate = clone $tenant1StartDate;
        while ($currentDate->lt($tenant1EndDate)) {
            // 部門ごとにインスタンスを作成
            foreach ($tenant1Departments as $department) {
                $instances[] = [
                    'tenant_id' => 1,
                    'department_id' => $department->id,
                    'setting_id' => $tenant1Settings->id,
                    'created_at' => $currentDate,
                    'updated_at' => $currentDate,
                ];
            }
            $currentDate->addDays($tenant1Settings->survey_delivery_interval_days);
        }
        
        // テナント2のパルスサーベイ実施（直近6ヶ月分）
        $tenant2Settings = DB::table('pulse_survey_settings')
            ->where('tenant_id', 2)
            ->first();
        
        // テナント2の部門を取得
        $tenant2Departments = DB::table('departments')
            ->where('tenant_id', 2)
            ->get();
        
        $tenant2StartDate = Carbon::parse($tenant2Settings->start_date);
        $tenant2EndDate = Carbon::now()->subDays(14); // 2週間前まで
        
        $currentDate = clone $tenant2StartDate;
        while ($currentDate->lt($tenant2EndDate)) {
            // 部門ごとにインスタンスを作成
            foreach ($tenant2Departments as $department) {
                $instances[] = [
                    'tenant_id' => 2,
                    'department_id' => $department->id,
                    'setting_id' => $tenant2Settings->id,
                    'created_at' => $currentDate,
                    'updated_at' => $currentDate,
                ];
            }
            $currentDate->addDays($tenant2Settings->survey_delivery_interval_days);
        }
        
        // バッチに分けて挿入（大量データのため）
        $chunks = array_chunk($instances, 500);
        foreach ($chunks as $chunk) {
            DB::table('pulse_survey_instances')->insert($chunk);
        }
    }
}