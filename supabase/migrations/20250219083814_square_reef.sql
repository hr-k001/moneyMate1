/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `description` (text)
      - `amount` (numeric)
      - `type` (text, either 'income' or 'expense')
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to:
      - Read their own transactions
      - Insert their own transactions
      - Delete their own transactions
*/

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);