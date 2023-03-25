import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Flex,
  Grid,
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
import { useQuery } from "react-query";
import Steps from "../../components/steps";
import { studentFormSchema } from "@/frontend/utils/validation";
import PageHeader from "@/components/page-header";

type StudentForm = Omit<Student, "id" | "sessionId">;

const StudentsPage = () => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [addStudentLoading, setAddStudentLoading] = useState(false);

  const { fetchStudents, fetchGrades } = queries;
  const { addStudent, removeStudent } = mutations;

  const form = useForm<StudentForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      grade: "",
    },
    validate: zodResolver(studentFormSchema),
  });

  const gradesQuery = useQuery("grades", fetchGrades);
  const studentsQuery = useQuery("students", fetchStudents);

  const grades = gradesQuery.data || [];
  const students = studentsQuery.data || [];

  const continueDisabled = students.length === 0;

  const onFormSubmit = async (data: StudentForm) => {
    setAddStudentLoading(true);
    await addStudent(data.firstName, data.lastName, data.grade);
    await studentsQuery.refetch();
    form.reset();
    firstNameRef.current?.focus();
    setAddStudentLoading(false);
  };

  const promptToRemoveStudent = async (student: Student) => {
    await removeStudent(student.id);
    studentsQuery.refetch();
  };

  return (
    <AppShell header={<PageHeader />}>
      <Steps active={0} />
      <main>
        <Flex justify="center">
          <Grid columns={2} w={1000} gutter="xl">
            <Grid.Col span={2}>
              <Title>Students</Title>
              <Text>Add at least one student to continue</Text>
            </Grid.Col>
            <Grid.Col span={1}>
              <Card withBorder style={{ overflow: "visible" }}>
                <form onSubmit={form.onSubmit(onFormSubmit)}>
                  <Stack>
                    <TextInput
                      ref={firstNameRef}
                      {...form.getInputProps("firstName")}
                      label="First name"
                    />
                    <TextInput
                      {...form.getInputProps("lastName")}
                      label="Last name"
                    />
                    <Select
                      {...form.getInputProps("grade")}
                      data={grades}
                      label="Grade"
                    />
                  </Stack>
                  <Flex mt={20}>
                    <Button
                      type="submit"
                      variant="default"
                      loading={addStudentLoading}
                    >
                      Add
                    </Button>
                  </Flex>
                </form>
              </Card>
            </Grid.Col>
            <Grid.Col span={1}>
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
            <Grid.Col span={2}>
              <Flex justify="end">
                <Button
                  disabled={continueDisabled}
                  color="yellow"
                  component={Link}
                  href="/meals"
                >
                  Continue
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Flex>
      </main>
    </AppShell>
  );
};

export default StudentsPage;
