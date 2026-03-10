import { getProjects } from "../actions/projects";
import WorkSectionClient from "./WorkSectionClient";

export default async function WorkSection() {
  const projects = await getProjects();
  return <WorkSectionClient projects={projects} />;
}
