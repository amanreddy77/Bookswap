import {User} from "@/types/user";
import Box from "@mui/joy/Box";
import * as React from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import { Avatar } from "@mui/joy";

interface ProfileProps {
    user: User
}

const Profile: React.FC<ProfileProps> = ({user}) => {
    return (
        <div>
            <Box
                sx={{ flex: 1, width: '100%' }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    width: '100%'
                }}>

                    <Stack>
                        <Avatar src={user.profile} sx={{ width: 200, height: 200 }}/>

                        <Typography level="h1">
                            {user.username}
                        </Typography>
                        <Typography level="title-lg">
                            {user.firstName}
                        </Typography>
                        <Typography level="title-md" paddingBottom={1} >
                            {user.lastName}
                        </Typography>

                        <Divider />

                    </Stack>
                </Box>


            </Box>

        </div>
    )
}

export default Profile;