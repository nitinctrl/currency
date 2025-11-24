-- Update default user passwords to 123456
-- Password hash for "123456" using bcrypt with 10 rounds

-- Superadmin: admin@bizacc.in
UPDATE profiles 
SET password_hash = '$2a$10$rYKsI8cBz0KHEqVqM7YMKuMm.TZvFQOF7NoL6xLPYqE.k5NQZqf8i'
WHERE email = 'admin@bizacc.in';

-- Admin: wildknot01@gmail.com
UPDATE profiles 
SET password_hash = '$2a$10$rYKsI8cBz0KHEqVqM7YMKuMm.TZvFQOF7NoL6xLPYqE.k5NQZqf8i'
WHERE email = 'wildknot01@gmail.com';

-- User: nygifting@gmail.com
UPDATE profiles 
SET password_hash = '$2a$10$rYKsI8cBz0KHEqVqM7YMKuMm.TZvFQOF7NoL6xLPYqE.k5NQZqf8i'
WHERE email = 'nygifting@gmail.com';

-- Verify the updates
SELECT email, role, name, 
       CASE 
         WHEN password_hash IS NOT NULL THEN 'Password set'
         ELSE 'No password'
       END as password_status
FROM profiles 
WHERE email IN ('admin@bizacc.in', 'wildknot01@gmail.com', 'nygifting@gmail.com')
ORDER BY 
  CASE role 
    WHEN 'superadmin' THEN 1 
    WHEN 'admin' THEN 2 
    WHEN 'user' THEN 3 
  END;
