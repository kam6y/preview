<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PulseSurveyQuestionSeeder extends Seeder
{
    /**
     * パルスサーベイの質問データをシード
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        // パルスサーベイインスタンスと質問の関連付け
        $questions = DB::table('survey_questions')->get();
        $instances = DB::table('pulse_survey_instances')->get();
        $pulse_survey_questions = [];
        
        foreach ($instances as $instance) {
            // 各インスタンスに対して、3つの質問をランダムに選択
            $selectedQuestions = $questions->random(3);
            
            foreach ($selectedQuestions as $question) {
                $pulse_survey_questions[] = [
                    'pulse_survey_instances_id' => $instance->id,
                    'survey_question_id' => $question->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }
        
        // バッチに分けて挿入（大量データのため）
        $chunks = array_chunk($pulse_survey_questions, 500);
        foreach ($chunks as $chunk) {
            DB::table('pulse_survey_questions')->insert($chunk);
        }
    }
}