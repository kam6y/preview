<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngagementSurveyInstance extends Model
{
    use HasFactory;

    protected $table = 'engagement_survey_instances';

    protected $fillable = [
        'tenant_id',
        'settings_id',
        'start_date',
        // 他の必要カラムを追加
    ];

    public function engagementSurveySetting()
    {
        return $this->belongsTo(EngagementSurveySetting::class, 'settings_id');
    }
}
