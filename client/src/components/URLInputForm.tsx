import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, Check } from "lucide-react";

// URL validation schema with automatic https:// handling
const formSchema = z.object({
  url: z.string()
    .min(1, "Please enter a domain name")
    .transform(val => {
      // Add https:// if not present
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    })
    .refine(val => {
      try {
        new URL(val);
        return true;
      } catch (e) {
        return false;
      }
    }, "Please enter a valid domain name")
});

type FormValues = z.infer<typeof formSchema>;

interface URLInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function URLInputForm({ onAnalyze, isLoading }: URLInputFormProps) {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
    mode: "onChange",
  });

  const handleSubmit = (values: FormValues) => {
    // The URL has already been transformed with https:// if needed
    onAnalyze(values.url);
  };

  // Update URL validity state on form state changes
  const validateUrl = (value: string) => {
    try {
      const result = formSchema.parse({ url: value });
      setIsValidUrl(true);
      return true;
    } catch (error) {
      setIsValidUrl(false);
      return false;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center sm:text-left">Analyze Website SEO Tags</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 left-0 pl-10 flex items-center text-gray-500 pointer-events-none">
                      https://
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        value={inputValue}
                        placeholder="example.com"
                        className="pl-[90px] pr-12 py-4 sm:py-6 text-base w-full"
                        onChange={(e) => {
                          // Strip out any http:// or https:// from user input
                          let value = e.target.value;
                          if (value.startsWith('http://')) {
                            value = value.substring(7);
                          } else if (value.startsWith('https://')) {
                            value = value.substring(8);
                          }
                          
                          setInputValue(value);
                          // Pass the full URL with https:// to the form field
                          field.onChange(`https://${value}`);
                          validateUrl(`https://${value}`);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    {isValidUrl && field.value && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-4 sm:py-6 text-base font-medium"
            disabled={isLoading || !form.formState.isValid}
          >
            Analyze
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
