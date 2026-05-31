import {
  Checkbox,
  Image,
  Radio,
  SimpleGrid,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
// import icons from "./icons";
import classes from "./ImageCheckBox.module.css";
import {
  IconAccessPoint,
  IconActivity,
  IconCropLandscape,
  IconHotelService,
} from "@tabler/icons-react";

interface ImageCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  title: string;
  description: string;
  image: React.ReactElement;
}

export function ImageCheckbox({
  checked,
  defaultChecked,
  onChange,
  title,
  description,
  className,
  image,
  ...others
}: ImageCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!value)}
      data-checked={value || undefined}
      className={classes.button}
    >
      {/* <Image src={image} alt={title} width={40} height={40} /> */}
      {image}
      <div className={classes.body}>
        <Text c="dimmed" size="xs" lh={1} mb={5}>
          {description}
        </Text>
        <Text fw={500} size="sm" lh={1}>
          {title}
        </Text>
      </div>

      <Checkbox
        checked={value}
        onChange={() => {}}
        tabIndex={-1}
        styles={{ input: { cursor: "pointer" } }}
      />
    </UnstyledButton>
  );
}

export function ImageRadio({
  checked,
  defaultChecked,
  onChange,
  title,
  description,
  className,
  image,
  ...others
}: ImageCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!value)}
      data-checked={value || undefined}
      className={classes.button}
    >
      {/* <Image src={image} alt={title} width={40} height={40} /> */}
      {image}
      <div className={classes.body}>
        <Text c="dimmed" size="xs" lh={1} mb={5}>
          {description}
        </Text>
        <Text fw={500} size="sm" lh={1}>
          {title}
        </Text>
      </div>

      <Radio
        checked={value}
        onChange={() => {}}
        tabIndex={-1}
        name="trialLocation"
        value="sola"
        // styles={{ input: { cursor: "pointer" } }}
      />
    </UnstyledButton>
  );
}

const mockdata = [
  // {
  //   description: "Sun and sea",
  //   title: "Beach vacation",
  //   image: <IconCropLandscape width={40} height={40} />,
  // },
  // {
  //   description: "Sightseeing",
  //   title: "City trips",
  //   image: <IconAccessPoint width={40} height={40} />,
  // },
  {
    description: "Mountains",
    title: "Hiking vacation",
    image: <IconActivity width={40} height={40} />,
  },
  {
    description: "Snow and ice",
    title: "Winter vacation",
    image: <IconHotelService width={40} height={40} />,
  },
];

export function ImageCheckboxes() {
  const items = mockdata.map((item) => (
    <ImageCheckbox {...item} key={item.title} />
  ));
  return <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }}>{items}</SimpleGrid>;
}

export function ImageRadioInputs() {
  const items = mockdata.map((item) => (
    <ImageRadio {...item} key={item.title} />
  ));
  return <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }}>{items}</SimpleGrid>;
}
