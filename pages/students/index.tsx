import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import { studentFormSchema } from "@/frontend/utils/validation";
import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Container,
  createStyles,
  Flex,
  Grid,
  MediaQuery,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Student } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Steps from "../../components/steps";

type StudentForm = Omit<Student, "id" | "sessionId">;

const useStyles = createStyles((theme) => ({
  container: {
    width: "1000px",
    // Dynamic media queries, define breakpoints in theme, use anywhere
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      width: "100%",
    },
  },
}));

const StudentFormComponent = ({
  grades,
  focusAfterSubmit,
}: {
  grades: string[];
  focusAfterSubmit: boolean;
}) => {
  const queryClient = useQueryClient();
  const { addStudent } = mutations;
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [addStudentLoading, setAddStudentLoading] = useState(false);

  const form = useForm<StudentForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      grade: "",
    },
    validate: zodResolver(studentFormSchema),
  });

  const onFormSubmit = async (data: StudentForm) => {
    setAddStudentLoading(true);
    await addStudent(data.firstName, data.lastName, data.grade);
    queryClient.refetchQueries("students");
    form.reset();
    if (focusAfterSubmit) {
      firstNameRef.current?.focus();
    }
    setAddStudentLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack>
        <TextInput
          ref={firstNameRef}
          {...form.getInputProps("firstName")}
          label="First name"
        />
        <TextInput {...form.getInputProps("lastName")} label="Last name" />
        <Select {...form.getInputProps("grade")} data={grades} label="Grade" />
      </Stack>
      <Flex mt={20}>
        <Button type="submit" variant="default" loading={addStudentLoading}>
          Add
        </Button>
      </Flex>
    </form>
  );
};

const StudentsPage = () => {
  const { fetchStudents, fetchGrades } = queries;
  const { removeStudent } = mutations;
  const { classes } = useStyles();

  const gradesQuery = useQuery("grades", fetchGrades);
  const studentsQuery = useQuery("students", fetchStudents);

  const grades = gradesQuery.data || [];
  const students = studentsQuery.data || [];

  const continueDisabled = students.length === 0;

  const promptToRemoveStudent = async (student: Student) => {
    await removeStudent(student.id);
    studentsQuery.refetch();
  };

  return (
    <AppShell>
      <Container mx="auto" className={classes.container} p={0}>
        <Steps active={0} />
        <Title>Students</Title>
        <Text>Add at least one student to continue</Text>
        <Grid columns={2} gutter="xl" mt="md">
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Grid.Col md={1}>
              <Card withBorder style={{ overflow: "visible" }}>
                <StudentFormComponent focusAfterSubmit grades={grades} />
              </Card>
            </Grid.Col>
          </MediaQuery>
          <Grid.Col md={1}>
            <Stack>
              {students.map((student) => (
                <Card withBorder py="sm" key={student.id}>
                  <Flex justify="space-between" align="center">
                    <div>
                      <Title size={16}>
                        {student.firstName} {student.lastName}
                      </Title>
                      <Text size="xs">{student.grade}</Text>
                    </div>
                    <ActionIcon
                      size="sm"
                      onClick={() => promptToRemoveStudent(student)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Grid.Col>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Grid.Col md={1}>
              <Card withBorder style={{ overflow: "visible" }}>
                <StudentFormComponent
                  focusAfterSubmit={false}
                  grades={grades}
                />
              </Card>
            </Grid.Col>
          </MediaQuery>
        </Grid>
        <Flex justify="end" mt="md">
          <Button
            disabled={continueDisabled}
            color="yellow"
            component={Link}
            href="/meals"
          >
            Continue
          </Button>
        </Flex>
      </Container>
    </AppShell>
  );
};

export default StudentsPage;
