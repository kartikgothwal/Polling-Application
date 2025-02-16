import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiPlus, FiX } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce"; // Import your custom debounce hook
import { useMutationQueries } from "@/apiquery/useApiQuery";

const pollSchema = z.object({
  question: z.string().min(1, "Please add a question!"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(4, "Please add at least four options!"),
  createdBy: z.string().min(1, "Please enter your name"),
  allowMultiple: z.boolean().default(false),
});

const PollForm = ({ redirectPath = "", onSubmit }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: "",
      createdBy: "anonymous",
      allowMultiple: false,
      options: [],
    },
  });

  const watchedOptions = watch("options", []);
  const debouncedOptions = useDebounce(watchedOptions, 300);

  const { mutate: createPollMutation } = useMutationQueries(
    "createPoll",
    "poll"
  );
  const handleAddOption = () => {
    const optionValue = watch("optionInput", "");
    if (optionValue.trim()) {
      if (debouncedOptions.length < 4) {
        setValue("options", [...debouncedOptions, optionValue], {
          shouldValidate: true,
        });
        setValue("optionInput", "");
      } else {
        toast.error("You can add at most four options!");
      }
    } else {
      toast.error("Please enter an option!");
    }
  };

  const handleRemoveOption = (index) => {
    setValue(
      "options",
      debouncedOptions.filter((_, i) => i !== index),
      {
        shouldValidate: true,
      }
    );
  };
  const onSubmitHandler = (values) => {
    console.log("🚀 ~ onSubmitHandler ~ values:", values);
    if (debouncedOptions.length < 4) {
      toast.error("Please add at least four options!");
      return;
    }
    createPollMutation(values, {
      onSuccess: (response) => {
        toast.success("Poll created successfully!");
        router.push(redirectPath);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-3 w-full h-full font-sans"
    >
      <div className="form-group flex flex-col w-full">
        <label htmlFor="question" className="text-gray-600 dark:text-gray-200">
          Question
        </label>
        <input
          {...register("question")}
          className="form-control  px-4 py-2 border-gray-400 border-2 rounded"
          placeholder="Enter question"
        />
        {errors.question && (
          <p className="text-red-500 text-sm">{errors.question.message}</p>
        )}
      </div>

      {debouncedOptions.length < 4 && (
        <div className="form-group flex flex-col w-full">
          <label className="text-gray-600 dark:text-gray-200">
            Add New Option (min 4, max 4)
          </label>
          <div className="flex gap-3">
            <input
              {...register("optionInput")}
              className="form-control px-4 py-2 border-gray-400 border-2 rounded w-full"
              placeholder="Enter option"
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-400 rounded"
              onClick={handleAddOption}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {debouncedOptions.length > 0 && (
        <div className="flex flex-col gap-3 w-full py-1">
          {debouncedOptions.map((option, index) => (
            <div key={index} className="flex gap-3">
              <input
                className="form-control px-4 py-2 border-gray-400 border-2 rounded w-full"
                value={option}
                readOnly
              />
              <button
                type="button"
                className="px-4 py-2 bg-red-400 rounded"
                onClick={() => handleRemoveOption(index)}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
      {errors.options && (
        <p className="text-red-500 text-sm">{errors.options.message}</p>
      )}

      <div className="form-group flex flex-col w-full">
        <label htmlFor="createdBy" className="text-gray-600 dark:text-gray-200">
          Created By
        </label>
        <input
          {...register("createdBy")}
          className="form-control px-4 py-2 border-gray-400 border-2 rounded w-full"
          placeholder="Enter your name"
        />
        {errors.createdBy && (
          <p className="text-red-500 text-sm">{errors.createdBy.message}</p>
        )}
      </div>

      <div className="form-group flex items-center gap-2">
        <input
          type="checkbox"
          {...register("allowMultiple")}
          className="form-checkbox h-5 w-5 text-green-400"
        />
        <label className="text-gray-600 dark:text-gray-200">
          Allow Multiple Selections
        </label>
      </div>

      <button type="submit" className="px-4 py-2 bg-green-400 rounded">
        Create Poll
      </button>
    </form>
  );
};

export default PollForm;
