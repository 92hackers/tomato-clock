import { TaskFormData, ValidationResult, ValidationRules } from '../types/task';

// 验证规则常量
export const VALIDATION_RULES: ValidationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  estimatedPomodoros: {
    min: 1,
    max: 20,
    default: 4,
  },
  notes: {
    maxLength: 500,
    optional: true,
  },
};

/**
 * 验证任务表单数据
 * @param data 表单数据
 * @returns 验证结果
 */
export function validateTaskForm(data: TaskFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // 验证标题
  if (!data.title || data.title.trim().length === 0) {
    errors.title = '任务名称不能为空';
  } else if (data.title.length > VALIDATION_RULES.title.maxLength) {
    errors.title = '任务名称不能超过100个字符';
  }

  // 验证预计番茄数
  if (data.estimatedPomodoros < VALIDATION_RULES.estimatedPomodoros.min || 
      data.estimatedPomodoros > VALIDATION_RULES.estimatedPomodoros.max) {
    errors.estimatedPomodoros = '预计番茄数必须在1-20之间';
  }

  // 验证备注（可选）
  if (data.notes && data.notes.length > VALIDATION_RULES.notes.maxLength) {
    errors.notes = '备注不能超过500个字符';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 验证单个字段
 * @param fieldName 字段名
 * @param value 字段值
 * @returns 错误信息，如果验证通过则返回空字符串
 */
export function validateField(fieldName: keyof TaskFormData, value: any): string {
  switch (fieldName) {
    case 'title':
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return '任务名称不能为空';
      }
      if (typeof value === 'string' && value.length > VALIDATION_RULES.title.maxLength) {
        return '任务名称不能超过100个字符';
      }
      return '';

    case 'estimatedPomodoros':
      if (typeof value !== 'number' || 
          value < VALIDATION_RULES.estimatedPomodoros.min || 
          value > VALIDATION_RULES.estimatedPomodoros.max) {
        return '预计番茄数必须在1-20之间';
      }
      return '';

    case 'notes':
      if (value && typeof value === 'string' && value.length > VALIDATION_RULES.notes.maxLength) {
        return '备注不能超过500个字符';
      }
      return '';

    default:
      return '';
  }
}

/**
 * 获取默认表单数据
 * @returns 默认表单数据
 */
export function getDefaultFormData(): TaskFormData {
  return {
    title: '',
    estimatedPomodoros: VALIDATION_RULES.estimatedPomodoros.default,
    notes: '',
  };
} 