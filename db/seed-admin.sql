-- Use this after running db/schema.sql.
-- Generate PASSWORD_HASH locally with:
--   npm run admin:hash -- "your-password"

insert into admin_users (name, email, password_hash)
values (
  'Administrador',
  'lomaexperience@admin.com',
  'scrypt:8398e503d45f09c656dda64f3878d150:74ae575ad7b5f944a4a74a92f6d7a218579cdd9b9dc1860d9683cd34d5b62321035e0379ef105834be8e6db5f8ff37d67d777d55f2335afc84516ab116eb99dd'
)
on conflict (email) do update
set
  name = excluded.name,
  password_hash = excluded.password_hash,
  is_active = true;
