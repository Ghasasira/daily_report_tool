<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Must be logged in and belong to a team
        return $this->user() && $this->user()->team_id !== null;
    }

    public function rules(): array
    {
        return [
            'tasks_handled'            => ['required', 'array', 'min:1'],
            'tasks_handled.*'          => ['required', 'string', 'max:500'],
            'tasks_completed'          => ['required', 'array'],
            'tasks_completed.*'        => ['required', 'string', 'max:500'],
            'challenges'               => ['nullable', 'string', 'max:2000'],
            'next_day_plan'            => ['nullable', 'string', 'max:2000'],
            'additional_notes'         => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'tasks_handled.required'  => 'Please add at least one task you handled today.',
            'tasks_handled.min'       => 'Please add at least one task you handled today.',
        ];
    }
}
