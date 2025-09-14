
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { handleCreatePost } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-provider';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLocale();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t.createPost}
    </Button>
  );
}

const initialState = {
  success: false,
  message: undefined,
  error: undefined,
};

export function CreatePostForm() {
  const [state, formAction] = useActionState(handleCreatePost, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    if (state.success) {
      toast({
        title: t.success,
        description: state.message,
      });
      formRef.current?.reset();
    }
  }, [state, toast, t]);

  return (
    <form action={formAction} ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>{t.createNewPost}</CardTitle>
          <CardDescription>
            {t.createNewPostDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.title}</Label>
            <Input id="title" name="title" placeholder={t.postTitlePlaceholder} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t.category}</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">{t.general}</SelectItem>
                <SelectItem value="Anxiety">{t.anxiety}</SelectItem>
                <SelectItem value="Depression">{t.depression}</SelectItem>
                <SelectItem value="Study Tips">{t.studytips}</SelectItem>
                <SelectItem value="Success Stories">{t.successstories}</SelectItem>
                <SelectItem value="Academics">{t.academics}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">{t.content}</Label>
            <Textarea
              id="content"
              name="content"
              placeholder={t.postContentPlaceholder}
              rows={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <SubmitButton />
          {state.error && (
            <Alert variant="destructive" className="py-2 px-3 text-xs w-auto">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
