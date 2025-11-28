-- 002_create_users_table.sql
-- Users table for the Pomodoro Timer application
-- Required for task ownership and session management

CREATE TABLE IF NOT EXISTS users (
    -- Primary key using UUID
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User authentication fields
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) UNIQUE,

    -- User profile fields (optional for future use)
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),

    -- Account status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Soft delete support
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_length CHECK (username IS NULL OR (LENGTH(username) >= 3 AND LENGTH(username) <= 50)),
    CONSTRAINT users_display_name_length CHECK (display_name IS NULL OR LENGTH(display_name) <= 100)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Comments for documentation
COMMENT ON TABLE users IS 'Users table for Pomodoro Timer application';
COMMENT ON COLUMN users.id IS 'Primary key using UUID';
COMMENT ON COLUMN users.email IS 'User email for authentication (unique, required)';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for authentication';
COMMENT ON COLUMN users.session_token IS 'Session token for maintaining login state';
COMMENT ON COLUMN users.username IS 'Unique username (optional)';
COMMENT ON COLUMN users.display_name IS 'Display name for UI (optional)';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN users.email_verified IS 'Whether the user email has been verified';
COMMENT ON COLUMN users.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN users.last_login_at IS 'Last login timestamp';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp (null if not deleted)';

-- Add foreign key constraint to tasks table (after users table is created)
ALTER TABLE tasks
ADD CONSTRAINT tasks_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();