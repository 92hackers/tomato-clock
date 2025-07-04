import { useState, useCallback, useMemo } from 'react';
import { TaskFormData, ValidationResult } from '../types/task';
import {
  validateTaskForm,
  validateField,
  getDefaultFormData,
  VALIDATION_RULES,
} from '../utils/formValidation';

export interface UseTaskFormReturn {
  // Form state
  formData: TaskFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;

  // Actions
  updateField: (fieldName: keyof TaskFormData, value: any) => void;
  incrementPomodoros: () => void;
  decrementPomodoros: () => void;
  validateForm: () => ValidationResult;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  submitForm: () => Promise<void>;
}

export function useTaskForm(
  initialData?: TaskFormData,
  onSubmit?: (data: TaskFormData) => Promise<void>
): UseTaskFormReturn {
  const defaultData = useMemo(
    () => initialData || getDefaultFormData(),
    [initialData]
  );

  const [formData, setFormData] = useState<TaskFormData>(defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // 计算表单是否有效
  const isValid = useMemo(() => {
    const validation = validateTaskForm(formData);
    return validation.isValid;
  }, [formData]);

  // 更新字段值
  const updateField = useCallback(
    (fieldName: keyof TaskFormData, value: any) => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value,
      }));

      // 实时验证字段
      const fieldError = validateField(fieldName, value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[fieldName] = fieldError;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });

      setIsDirty(true);
    },
    []
  );

  // 增加番茄数
  const incrementPomodoros = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      estimatedPomodoros: Math.min(
        prev.estimatedPomodoros + 1,
        VALIDATION_RULES.estimatedPomodoros.max
      ),
    }));
    setIsDirty(true);
  }, []);

  // 减少番茄数
  const decrementPomodoros = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      estimatedPomodoros: Math.max(
        prev.estimatedPomodoros - 1,
        VALIDATION_RULES.estimatedPomodoros.min
      ),
    }));
    setIsDirty(true);
  }, []);

  // 验证整个表单
  const validateForm = useCallback((): ValidationResult => {
    const validation = validateTaskForm(formData);
    setErrors(validation.errors);
    return validation;
  }, [formData]);

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(defaultData);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [defaultData]);

  // 设置提交状态
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  // 提交表单
  const submitForm = useCallback(async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      return;
    }

    if (!onSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm]);

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    updateField,
    incrementPomodoros,
    decrementPomodoros,
    validateForm,
    resetForm,
    setSubmitting,
    submitForm,
  };
}
