-- 001_create_tasks_table.sql
-- Task table for Pomodoro Timer application
-- Based on the add-task page design and TypeScript interfaces

CREATE TABLE IF NOT EXISTS tasks (
    -- Primary key using UUID for better security and distribution
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Task fields from the add-task page design
    title VARCHAR(100) NOT NULL,
    notes VARCHAR(500),
    estimated_pomodoros INTEGER NOT NULL DEFAULT 4,
    completed_pomodoros INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Foreign key to users table (assuming we have one)
    user_id UUID NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Soft delete support
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT tasks_title_length CHECK (LENGTH(TRIM(title)) >= 1 AND LENGTH(title) <= 100),
    CONSTRAINT tasks_pomodoros_range CHECK (estimated_pomodoros >= 1 AND estimated_pomodoros <= 20),
    CONSTRAINT tasks_completed_pomodoros_range CHECK (completed_pomodoros >= 0),
    CONSTRAINT tasks_completed_not_greater_than_estimated
        CHECK (completed_pomodoros <= estimated_pomodoros)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at);

-- Comments for documentation
COMMENT ON TABLE tasks IS 'Task table for Pomodoro Timer application';
COMMENT ON COLUMN tasks.id IS 'Primary key using UUID for security and distribution';
COMMENT ON COLUMN tasks.title IS 'Task title (required, 1-100 characters)';
COMMENT ON COLUMN tasks.notes IS 'Optional task notes (max 500 characters)';
COMMENT ON COLUMN tasks.estimated_pomodoros IS 'Estimated number of pomodoro sessions (1-20)';
COMMENT ON COLUMN tasks.completed_pomodoros IS 'Number of completed pomodoro sessions (0+)';
COMMENT ON COLUMN tasks.completed IS 'Whether the task is completed';
COMMENT ON COLUMN tasks.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN tasks.created_at IS 'Creation timestamp';
COMMENT ON COLUMN tasks.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN tasks.deleted_at IS 'Soft delete timestamp (null if not deleted)';

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();