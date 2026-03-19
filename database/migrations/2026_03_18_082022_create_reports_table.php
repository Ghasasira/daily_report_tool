<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->date('report_date');

            // Core report fields
            $table->json('tasks_handled');       // array of task strings
            $table->json('tasks_completed');     // array of completed task strings
            $table->text('challenges')->nullable();
            $table->text('next_day_plan')->nullable();
            $table->text('additional_notes')->nullable();

            // Track email delivery
            $table->timestamp('email_sent_at')->nullable();
            $table->string('email_status')->default('pending'); // pending|sent|failed

            $table->timestamps();

            // One report per user per day
            $table->unique(['user_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
