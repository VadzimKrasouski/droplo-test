"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { INavigationItem } from "@/types/navigationTypes";

import AutocompleteInput from "./AutocompleteInput";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  label: z
    .string()
    .min(1, "Nazwa jest wymagana")
    .max(50, "Nazwa nie może być dłuższa niż 50 znaków"),
  url: z
    .string()
    .min(1, "Link jest wymagany")
    .url("Nieprawidłowy format linku")
    .refine((url) => url.startsWith("https://"), {
      message: "Link musi zaczynać się od https://",
    }),
});

interface NavigationFormProps {
  initialData?: INavigationItem;
  onSubmit: (data: INavigationItem) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const urls: string[] = [
  "https://example.com",
  "https://google.com",
  "https://github.com",
  "https://stackoverflow.com",
  "https://shadcn.dev",
];

export function NavigationItemForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
}: NavigationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      url: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      ...values,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-white px-6 py-5 w-full space-y-4"
      >
        <div className="flex gap-4">
          <div className="flex-1 gap-2">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. Promocje"
                      {...field}
                      className="bg-background-white shadow-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      options={urls}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Wklej lub wyszukaj"
                      className="bg-background-white shadow-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="flex justify-center items-center h-10 w-10 text-primary hover:text-red hover:bg-white"
            >
              <Trash2 />
              <span className="sr-only">Usuń</span>
            </Button>
          )}
        </div>
        <div className="flex justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="button"
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="button border-brand text-brand-500"
          >
            {initialData ? "Zapisz" : "Dodaj"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
