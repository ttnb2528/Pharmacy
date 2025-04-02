import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MobileNav = ({ open, setOpen }) => {
  const { categories } = useContext(PharmacyContext);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
        <ScrollArea className="h-full py-6 px-2">
          <div className="flex flex-col gap-4 py-2">
            <h2 className="px-4 text-lg font-semibold">Danh mục sản phẩm</h2>
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <Link
                      to={`/${slugify(category.name, { lower: true })}`}
                      onClick={() => setOpen(false)}
                      className="flex-1 text-left"
                    >
                      {category.name}
                    </Link>
                  </AccordionTrigger>
                  {category.subcategories && (
                    <AccordionContent className="pl-8">
                      <div className="flex flex-col space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/${slugify(category.name, {
                              lower: true,
                            })}/${slugify(subcategory.name, { lower: true })}`}
                            onClick={() => setOpen(false)}
                            className="py-1 hover:text-primary transition-colors"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
