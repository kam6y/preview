<?php

namespace App\Http\Controllers;

use App\Models\PulseSurveyQuestion;
use Illuminate\Http\Request;

class PulseSurveyQuestionController extends Controller
{
    public function index($tenant_id, $instance_id)
    {
        // 1) tenant_id と instance_id が合致する PulseSurveyQuestion を抽出
        // 2) そのとき、関連する SurveyQuestion も一緒に取得 (with)
        $pulseSurveyQuestions = PulseSurveyQuestion::where('pulse_survey_instances_id', $instance_id)
            ->with('surveyQuestion') // ここでリレーション先を読み込む
            ->get();

        // 取得したコレクションを map して、必要なカラムだけ整形
        $questions = $pulseSurveyQuestions->map(function ($pulseSurveyQuestion) {
            // リレーション先の SurveyQuestion モデルを取得
            $surveyQuestion = $pulseSurveyQuestion->surveyQuestion;

            return [
                'id'             => $surveyQuestion->id,
                'issue_category' => $surveyQuestion->issue_category,
                'question_text'  => $surveyQuestion->question_text,
            ];
        });

        // JSON 形式で返す
        return response()->json(['questions' => $questions]);
    }
}
