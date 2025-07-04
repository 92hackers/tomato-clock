import { 
  LoginFormData, 
  RegisterFormData, 
  ValidationResult, 
  AUTH_STORAGE_KEYS,
  User 
} from '../types/auth';

// 验证规则常量
export const AUTH_VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
} as const;

/**
 * 验证登录表单数据
 */
export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // 验证邮箱
  if (!data.email || data.email.trim().length === 0) {
    errors.email = '请输入邮箱';
  } else if (!AUTH_VALIDATION_RULES.email.pattern.test(data.email)) {
    errors.email = '请输入有效的邮箱地址';
  }

  // 验证密码
  if (!data.password || data.password.length === 0) {
    errors.password = '请输入密码';
  } else if (data.password.length < AUTH_VALIDATION_RULES.password.minLength) {
    errors.password = `密码至少需要${AUTH_VALIDATION_RULES.password.minLength}个字符`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 验证注册表单数据
 */
export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // 验证用户名
  if (!data.username || data.username.trim().length === 0) {
    errors.username = '请输入用户名';
  } else if (data.username.length < AUTH_VALIDATION_RULES.username.minLength) {
    errors.username = `用户名至少需要${AUTH_VALIDATION_RULES.username.minLength}个字符`;
  } else if (data.username.length > AUTH_VALIDATION_RULES.username.maxLength) {
    errors.username = `用户名不能超过${AUTH_VALIDATION_RULES.username.maxLength}个字符`;
  } else if (!AUTH_VALIDATION_RULES.username.pattern.test(data.username)) {
    errors.username = '用户名只能包含字母、数字和下划线';
  }

  // 验证邮箱
  if (!data.email || data.email.trim().length === 0) {
    errors.email = '请输入邮箱';
  } else if (!AUTH_VALIDATION_RULES.email.pattern.test(data.email)) {
    errors.email = '请输入有效的邮箱地址';
  }

  // 验证密码
  if (!data.password || data.password.length === 0) {
    errors.password = '请输入密码';
  } else if (data.password.length < AUTH_VALIDATION_RULES.password.minLength) {
    errors.password = `密码至少需要${AUTH_VALIDATION_RULES.password.minLength}个字符`;
  } else if (data.password.length > AUTH_VALIDATION_RULES.password.maxLength) {
    errors.password = `密码不能超过${AUTH_VALIDATION_RULES.password.maxLength}个字符`;
  }

  // 验证确认密码
  if (!data.confirmPassword || data.confirmPassword.length === 0) {
    errors.confirmPassword = '请确认密码';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不匹配';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 验证单个字段
 */
export function validateAuthField(
  fieldName: keyof (LoginFormData & RegisterFormData),
  value: string,
  extraData?: Partial<RegisterFormData>
): string {
  switch (fieldName) {
    case 'username':
      if (!value || value.trim().length === 0) {
        return '请输入用户名';
      }
      if (value.length < AUTH_VALIDATION_RULES.username.minLength) {
        return `用户名至少需要${AUTH_VALIDATION_RULES.username.minLength}个字符`;
      }
      if (value.length > AUTH_VALIDATION_RULES.username.maxLength) {
        return `用户名不能超过${AUTH_VALIDATION_RULES.username.maxLength}个字符`;
      }
      if (!AUTH_VALIDATION_RULES.username.pattern.test(value)) {
        return '用户名只能包含字母、数字和下划线';
      }
      return '';

    case 'email':
      if (!value || value.trim().length === 0) {
        return '请输入邮箱';
      }
      if (!AUTH_VALIDATION_RULES.email.pattern.test(value)) {
        return '请输入有效的邮箱地址';
      }
      return '';

    case 'password':
      if (!value || value.length === 0) {
        return '请输入密码';
      }
      if (value.length < AUTH_VALIDATION_RULES.password.minLength) {
        return `密码至少需要${AUTH_VALIDATION_RULES.password.minLength}个字符`;
      }
      if (value.length > AUTH_VALIDATION_RULES.password.maxLength) {
        return `密码不能超过${AUTH_VALIDATION_RULES.password.maxLength}个字符`;
      }
      return '';

    case 'confirmPassword':
      if (!value || value.length === 0) {
        return '请确认密码';
      }
      if (extraData?.password && value !== extraData.password) {
        return '两次输入的密码不匹配';
      }
      return '';

    default:
      return '';
  }
}

/**
 * 本地存储操作
 */
export const authStorage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    }
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    }
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      Object.values(AUTH_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  },
};

/**
 * 检查 token 是否过期
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * 生成默认的登录表单数据
 */
export function getDefaultLoginFormData(): LoginFormData {
  return {
    email: '',
    password: '',
  };
}

/**
 * 生成默认的注册表单数据
 */
export function getDefaultRegisterFormData(): RegisterFormData {
  return {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
} 