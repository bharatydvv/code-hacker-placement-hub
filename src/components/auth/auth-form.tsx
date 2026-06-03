'use client';
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type ActionState = { error?: string; success?: string } | undefined;
type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Please wait…' : label}
    </Button>
  );
}

export function AuthForm({
  action,
  label,
  fields,
  footer,
}: {
  action: Action;
  label: string;
  fields: { name: string; type: string; placeholder: string; label: string }[];
  footer?: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, undefined);
  return (
    <form action={formAction} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <label htmlFor={f.name} className="text-sm font-medium">{f.label}</label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          />
        </div>
      ))}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-accent">{state.success}</p>}
      <SubmitButton label={label} />
      {footer}
    </form>
  );
}

export function GoogleButton({
  action,
}: {
  action: () => Promise<{ error?: string } | void>;
}) {
  return (
    <form action={async () => { await action(); }}>
      <Button type="submit" variant="outline" className="w-full">
        Continue with Google
      </Button>
    </form>
  );
}
