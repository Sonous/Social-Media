import { Outlet } from "react-router";

function MainLayout() {
  return (
    <>
      <header className="bg-gray-600 flex justify-center items-center p-10">
        <h1>MainLayout</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
