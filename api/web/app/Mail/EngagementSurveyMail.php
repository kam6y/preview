<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EngagementSurveyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $staff;
    public $tenantId;
    public $setting;
    public $instanceId;

    /**
     * Create a new message instance.
     */
    public function __construct($staff, $tenantId, $setting, $instanceId)
    {
        $this->staff    = $staff;
        $this->tenantId = $tenantId;
        $this->setting  = $setting;
        $this->instanceId = $instanceId;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // tenantId から Tenant を取得
        $tenant = \App\Models\Tenant::find($this->tenantId);
        $surveytype = 1;

        return $this
            ->subject('アンケートご案内')
            ->view('mail.engagement_survey')
            ->with([
                'tenantID' => $this->tenantId,
                'tenantName'   => $tenant->name,
                'instanceID' => $this->instanceId,
                'survey_type'   => $surveytype,
            ]);
    }
}
