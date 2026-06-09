'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteCommentAction } from './actions';

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  return (
    <form action={deleteCommentAction.bind(null, commentId)}>
      <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive ml-4">
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}