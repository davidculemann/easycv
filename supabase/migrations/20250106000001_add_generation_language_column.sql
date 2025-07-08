-- Add generation_language column to existing preferences table
ALTER TABLE public.preferences 
ADD COLUMN generation_language TEXT DEFAULT 'english';

-- Update existing rows to have the default value
UPDATE public.preferences 
SET generation_language = 'english' 
WHERE generation_language IS NULL; 