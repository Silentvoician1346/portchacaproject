import { useState } from "react";
import { GetStaticProps, GetServerSideProps } from "next";

import {
  Box,
  Container,
  Button,
  Flex,
  HStack,
  Spacer,
  Grid,
  Image,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

export async function getStaticProps() {
  const res = await fetch("https://inter-test.herokuapp.com/jobs");
  const datas = await res.json();
  // const tags = datas.map((obj) => [obj.role, obj.languages, obj.tools]);
  const oldDatas = datas.map((idData) => ({
    ...idData,
    tags: [idData.tools, idData.role, ...idData.languages],
  }));
  return { props: { oldDatas } };
}

export default function Index({ oldDatas }) {
  const [term, setTerm] = useState([]);

  const [level, setLevel] = useState("");

  const newDatas = oldDatas.filter(function (oldData) {
    if (level == "") {
      return oldDatas;
    }
    if (oldData.level == level) {
      return true;
    } else {
      return false;
    }
  });
  // console.log(newDatas);

  const jobs = newDatas.filter(function (data) {
    if (term == []) {
      return newDatas;
    }
    for (let dex of term) {
      // console.log(dex);
      if (!data.tags.includes(dex)) {
        return false;
      }
    }
    return true;
  });

  return (
    <Container
      w="375px"
      h="full"
      fontFamily="Spartan, sans-serif"
      fontWeight="700"
      fontSize="15px"
      p="0px"
      bg="#f0fafb"
    >
      <Box
        w="100vw"
        h="160px"
        bg="#5da5a4"
        bgImage="/images/bg-header-mobile.svg"
        overflow="visible"
      >
        <Box w="5px" h="120px" />
        <HStack
          w={level != "" || term.length != 0 ? "325px" : 0}
          h={level != "" || term.length != 0 ? "full" : 0}
          bg="white"
          zIndex="modal"
          mx="auto"
          rounded="lg"
          shadow="xl"
        >
          <Box m="20px">
            <Grid templateColumns="repeat(2, 1fr)" gap={6} w="200px" h="full">
              {/* TAGS  */}
              {term.map((t) => (
                <Flex boxSize={term == [] ? 0 : "full"}>
                  <Box
                    color="#57a3a0"
                    bg="#f0f6f6"
                    py="4px"
                    px="8px"
                    fontWeight="700"
                    roundedLeft="lg"
                  >
                    {t}
                  </Box>
                  <Image
                    onClick={function removeTags() {
                      let tempState = [...term];
                      let index = tempState.indexOf(t);
                      if (index !== -1) {
                        tempState.splice(index, 1);
                      }
                      console.log("remove");

                      setTerm(tempState);
                    }}
                    padding={term == [] ? 0 : "8px"}
                    boxSize={term == [] ? 0 : "32px"}
                    bg="#57a3a0"
                    _hover={{ bg: "#2b3a39" }}
                    src="images/icon-remove.svg"
                    roundedRight="lg"
                  />
                </Flex>
              ))}
              {/* LEVEL  */}
              <Flex boxSize={level == "" ? 0 : "full"}>
                <Box
                  color="#57a3a0"
                  bg="#f0f6f6"
                  py={level == "" ? 0 : "4px"}
                  px={level == "" ? 0 : "8px"}
                  fontWeight="700"
                  roundedLeft="lg"
                >
                  {level}
                </Box>
                <Image
                  onClick={function removeLevel() {
                    setLevel("");
                  }}
                  padding={level == "" ? 0 : "8px"}
                  boxSize={level == "" ? 0 : "32px"}
                  bg="#57a3a0"
                  _hover={{ bg: "#2b3a39" }}
                  src="images/icon-remove.svg"
                  roundedRight="lg"
                />
              </Flex>
            </Grid>
          </Box>
          <Spacer />
          <Button bg="none" _hover={{}} _active={{}}>
            <Box
              fontWeight="700"
              color="#7e8786"
              pr="16px"
              onClick={function clear() {
                setTerm([]);
                setLevel("");
              }}
            >
              Clear
            </Box>
          </Button>
        </HStack>

        <Box mt="80px" bg="#f0fafb">
          {jobs.map((job) => (
            <Box
              w="325px"
              h="250px"
              mx="auto"
              bg="white"
              p="26px"
              overflow="visible"
              mb="40px"
              pb="-250px"
              rounded="lg"
              shadow="xl"
            >
              <Image
                boxSize="48px"
                pos="relative"
                top="-50px"
                src="/images/photosnap.svg"
              />
              <Box pos="relative" top="-50px">
                <Flex top="-100px">
                  <Box color="#57a3a0" py="2px" rounded="full" mr="8px">
                    {job.company}
                  </Box>
                  <Box
                    bg="#57a3a0"
                    fontSize="12px"
                    color="white"
                    py="5px"
                    px="10px"
                    rounded="full"
                    mx="8px"
                    opacity={job.new == true ? 100 : 0}
                  >
                    NEW!
                  </Box>
                  <Box
                    bg="#2b3939"
                    fontSize="12px"
                    color="white"
                    py="5px"
                    px="10px"
                    rounded="full"
                    opacity={job.featured == true ? 100 : 0}
                  >
                    FEATURED
                  </Box>
                </Flex>
                <Text my="8px" color="black" _hover={{ color: "#57a3a0" }}>
                  {job.position}
                </Text>
                <Text fontWeight="500" my="8px" color="#8f9998;">
                  {job.posted_at} &#8226; {job.contract} &#8226; {job.location}
                </Text>
                <Box w="full" h="1px" mb="16px" bg="#8f9998;" />
                <Flex wrap="wrap">
                  {job.tags.slice(1).map((tag) => (
                    <Box
                      onClick={
                        term.includes(tag)
                          ? function removeTags() {
                              let tempState = [...term];
                              let index = tempState.indexOf(tag);
                              if (index !== -1) {
                                tempState.splice(index, 1);
                              }
                              console.log("remove");

                              setTerm(tempState);
                            }
                          : function addTags() {
                              let tempState = [...term];
                              tempState.push(tag);
                              console.log("add");
                              setTerm(tempState);
                            }
                      }
                      bg="#f2f5f4"
                      color="#57a3a0"
                      _hover={{ bg: "#57a3a0", color: "#f2f5f4" }}
                      px="10px"
                      py="4px"
                      m="8px"
                      rounded="lg"
                    >
                      {tag}
                    </Box>
                  ))}
                  <Box
                    onClick={
                      level == job.level
                        ? function removeLevel() {
                            setLevel("");
                            console.log("remove Level");
                          }
                        : function addLevel() {
                            setLevel(job.level);
                            console.log("add Level");
                          }
                    }
                    bg="#f2f5f4"
                    color="#57a3a0"
                    px="10px"
                    py="4px"
                    m="8px"
                  >
                    {job.level}
                  </Box>
                </Flex>
              </Box>

              {/* DESIGN SECTION  */}

              {/* <Button
                onClick={
                  level == job.level
                    ? function removeLevel() {
                        setLevel("");
                        console.log("remove Level");
                      }
                    : function addLevel() {
                        setLevel(job.level);
                        console.log("add Level");
                      }
                }
              >
                {job.level}
              </Button>
              <Box>
                {job.tags.slice(1).map((tag) => (
                  <Button
                    onClick={
                      term.includes(tag)
                        ? function removeTags() {
                            let tempState = [...term];
                            let index = tempState.indexOf(tag);
                            if (index !== -1) {
                              tempState.splice(index, 1);
                            }
                            console.log("remove");

                            setTerm(tempState);
                          }
                        : function addTags() {
                            let tempState = [...term];
                            tempState.push(tag);
                            console.log("add");
                            setTerm(tempState);
                          }
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </Box> */}
              {/* <Box>{job.company}</Box>
              <Box>new</Box>
              <Box>featured</Box>
              <Box>{job.position}</Box>
              <Box>
                {job.posted_at} - {job.contract} - {job.location}
              </Box>
              <Box>{job.role} </Box>
              {job.languages.map((language) => (
                <Box>{language}</Box>
              ))}
              <Box>new</Box>
              <Box>featured</Box>
              <Box>{job.company}</Box> */}

              {/* <Box h="10px" w="100vw" bg="black" /> */}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
