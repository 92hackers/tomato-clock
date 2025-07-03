import { validateTaskForm, ValidationResult, TaskFormData } from '../formValidation';

describe('formValidation', () => {
  describe('validateTaskForm', () => {
    it('should pass validation for valid task data', () => {
      const validTaskData: TaskFormData = {
        title: 'Complete project documentation',
        estimatedPomodoros: 4,
        notes: 'Focus on API documentation'
      };

      const result: ValidationResult = validateTaskForm(validTaskData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should fail validation for empty title', () => {
      const invalidTaskData: TaskFormData = {
        title: '',
        estimatedPomodoros: 4,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('任务名称不能为空');
    });

    it('should fail validation for title with only whitespace', () => {
      const invalidTaskData: TaskFormData = {
        title: '   ',
        estimatedPomodoros: 4,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('任务名称不能为空');
    });

    it('should fail validation for title exceeding max length', () => {
      const longTitle = 'a'.repeat(101); // 101 characters
      const invalidTaskData: TaskFormData = {
        title: longTitle,
        estimatedPomodoros: 4,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('任务名称不能超过100个字符');
    });

    it('should fail validation for estimated pomodoros less than 1', () => {
      const invalidTaskData: TaskFormData = {
        title: 'Valid title',
        estimatedPomodoros: 0,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedPomodoros).toBe('预计番茄数必须在1-20之间');
    });

    it('should fail validation for estimated pomodoros greater than 20', () => {
      const invalidTaskData: TaskFormData = {
        title: 'Valid title',
        estimatedPomodoros: 21,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedPomodoros).toBe('预计番茄数必须在1-20之间');
    });

    it('should fail validation for notes exceeding max length', () => {
      const longNotes = 'a'.repeat(501); // 501 characters
      const invalidTaskData: TaskFormData = {
        title: 'Valid title',
        estimatedPomodoros: 4,
        notes: longNotes
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.notes).toBe('备注不能超过500个字符');
    });

    it('should pass validation for empty notes', () => {
      const validTaskData: TaskFormData = {
        title: 'Valid title',
        estimatedPomodoros: 4,
        notes: ''
      };

      const result: ValidationResult = validateTaskForm(validTaskData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should pass validation for undefined notes', () => {
      const validTaskData: TaskFormData = {
        title: 'Valid title',
        estimatedPomodoros: 4
      };

      const result: ValidationResult = validateTaskForm(validTaskData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return multiple validation errors', () => {
      const invalidTaskData: TaskFormData = {
        title: '',
        estimatedPomodoros: 25,
        notes: 'a'.repeat(501)
      };

      const result: ValidationResult = validateTaskForm(invalidTaskData);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('任务名称不能为空');
      expect(result.errors.estimatedPomodoros).toBe('预计番茄数必须在1-20之间');
      expect(result.errors.notes).toBe('备注不能超过500个字符');
    });

    it('should handle boundary values correctly', () => {
      const boundaryValidData: TaskFormData = {
        title: 'a', // minimum length
        estimatedPomodoros: 1, // minimum value
        notes: 'a'.repeat(500) // maximum length
      };

      const result: ValidationResult = validateTaskForm(boundaryValidData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should handle boundary values correctly for maximum', () => {
      const boundaryValidData: TaskFormData = {
        title: 'a'.repeat(100), // maximum length
        estimatedPomodoros: 20, // maximum value
        notes: 'a'.repeat(500) // maximum length
      };

      const result: ValidationResult = validateTaskForm(boundaryValidData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
}); 