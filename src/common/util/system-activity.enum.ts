export enum SystemActivity {
  'user_login' = 0,
  'register_user' = 1,
  'add_raw_material' = 2,
  'add_supplier' = 3,
  'update_raw_material' = 4,
  'update_supplier' = 5,
  'delete_user' = 6,
  'update_user' = 7,
  'delete_raw_material' = 8,
}

export enum SystemActivityMsg {
  'User logged in',
  'User created',
  'Raw material added',
  'Supplier added',
  'Raw material updated',
  'Supplier updated',
  'User deleted',
  'User updated',
  'Raw material deleted',
}
